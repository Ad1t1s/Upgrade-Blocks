let http = require('http');
let mongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/qarea';
const table = 'blocks';
function connect() {
    return mongoClient.connect(url).then(function(connection) {
        return connection.collection(table);
    });
}

function insert(data, cb) {
    connect().then(
        function(table) {
	    return table.insertOne(data);
	}
    ).then(
        function(result) {
	    if(data.root) {
                // do nothing
	    } else if (data.children) {
		findAndUpdateRoot(result.insertedId);
	    } else {
		findAndUpdateTopLevel(result.insertedId, data.parentColumn);
	    }
	    cb(result.insertedId);
	}
    );

}

function findAndUpdateRoot(id) {
    let table;
    connect().then(
        function(db_table) {
            table = db_table;
	    return table.find({ root: true}).next();
	}
    ).then(
        function(doc){
	    if (!doc) return;
	    doc.siblings.push(id);
	    table.updateOne(
		{ _id : doc._id },
		{$set: doc}
            );
	}
    );
}

function findAndUpdateTopLevel(id, columnIndex) {
    let table;
    connect().then(
        function(db_table) {
            table = db_table;
	    return table.find({ root: true}).next();
	}
    ).then(
        function(doc){
	    if (!doc) return null;

	    let top_level_id = doc._id;

	    if (columnIndex !== 0) {
		top_level_id = doc.siblings[columnIndex - 1];
	    }

	    return table.find({ _id: top_level_id}).next();
	}
    ).then(
        function(doc){
	    if (!doc) return;
	    doc.children.push(id);
	    table.updateOne(
		{ _id : doc._id },
		{$set: doc}
            );
	}
    );
}


function remove(req, res) {
    let data = [];
    req.on('data', function(chunk) {
	data.push(chunk);
    });

    req.on('end', function() {
        let db_table;
	let text = Buffer.concat(data).toString();
        data = JSON.parse(text);

        connect().then(function(table){
            db_table = table;
            return table.find({root: true}).next();
        }).then(function(doc) {

            if (!doc) return null;
            let siblings = [doc._id].concat(doc.siblings);

            if (data.block === 0) {
                let ids = siblings.slice(data.column);
                if (data.column) {
                    doc.siblings.splice(data.column - 1);
                    db_table.updateOne(
                        {_id: doc._id},
                        {$set: doc}
                    );
                }
                return db_table.find({_id: {$in: ids}}).toArray();

            } else {

                return db_table.find({_id: siblings[data.column]}).toArray();
            }
        }).then(function(docs) {

            let ids = [];
            for (let doc of docs) {

                ids = ids.concat([doc._id].concat(doc.children));
                if (docs.length === 1 && data.block && doc.children) {
                    doc.children.splice(data.block - 1);
                    db_table.updateOne(
                        {_id: doc._id},
                        {$set: doc}
                    );
                }

            }

            let to_remove = ids.slice(data.block);
            return db_table.remove({_id: {$in: to_remove}});
        }).then(function(data) {

	    make_response({
	        status: 'success',
	        error: false,
	        ok: true,
	        data: data
	    }, res);
        });



    });

}

function get_all(req, res) {
    connect().then(
        function(table) {
            return table.find().toArray();
        }
    ).then(
        function(data) {
	    make_response({
	        status: 'success',
	        error: false,
	        ok: true,
	        data: data
	    }, res);
        }
    );
}


function create(req, res) {
    let data = [];
    req.on('data', function(chunk) {
	data.push(chunk);
    });

    req.on('end', function() {
	let text = Buffer.concat(data).toString();

	let obj = JSON.parse(text);

	let cb = function(id) {


	    make_response({
		status: 'success',
		error: false,
		ok: true,
		data: {id: id}
	    }, res);
	};

	insert(obj, cb);
    });

}
function not_found(req, res) {
    make_response({
	status: 'error',
	error: true,
	ok: false,
	data: null
    }, res);
}

let server = http.createServer(
    function(req, res){
	let result = null;
	switch(req.url) {
	case '/create':
	    create(req, res);
	    break;
	case '/':
	    get_all(req, res);
	    break;
	case '/remove':
	    remove(req, res);
	    break;
	default:
	    not_found(req, res);
	}

    }
);

function make_response(result, res) {
    let text = JSON.stringify(result);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Length', text.length);
    res.setHeader('Access-Control-Request-Method', '*');
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, DELETE');
    res.setHeader('Cache-Control', 'no-cache');
    res.write(text);
    res.end();
}
server.listen(8000);
