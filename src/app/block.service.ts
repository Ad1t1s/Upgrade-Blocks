import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

const server = 'http://localhost:8000';


@Injectable()
export class BlockService {
    private serverDisabled = false;

    addBlock(columnIndex, title) {
  	    let col_len = this.blocks[columnIndex].push(title);

        let to_server = {
            title: title,
            root: false,
            siblings: null,
            children: null,
            parentColumn: columnIndex
        }
        if (columnIndex === 0 && col_len === 1) {
            to_server.root = true;
            to_server.siblings = []
        }
        if (col_len === 1) {
            to_server.children = []
        }

        if (this.serverDisabled) return;

        this.http.post(server + '/create', JSON.stringify(to_server)).subscribe(
            function(data) {
                let resp = data.json();
                if (resp.ok) {
                    console.log(resp.data);
                } else {
                    console.error('NO')
                }
            }
        )
    }


    private blocks: string[][] = [

    ];

    constructor(private http: Http) {
        this.serverDisabled = true;
        let self = this;
        http.get(server).subscribe(function(response) {
            let data = response.json();
            if (data.ok) {
                let structure = {
                    blocks: {},
                    children: {},
                    siblings: []
                }
                Array.prototype.slice.apply(data.data).reduce(function(r, n){

                    if (n.root) {
                        r.siblings = [n._id].concat(n.siblings);
                    }
                    if (n.children) {
                        r.children[n._id] = n.children
                    }
                    r.blocks[n._id] = n.title;
                    return r;
                }, structure);

                for (let colIndex in structure.siblings) {
                    let col_top = structure.siblings[colIndex];
                    self.addColumn(structure.blocks[col_top]);
                    let children = structure.children[col_top] || [];
                    for (let child of children) {
                        self.addBlock(colIndex, structure.blocks[child]);
                    }

                }

            } else {
                console.error('cant get data from server');
            }
            self.serverDisabled = false;
        });
    }

    addColumn(title) {
        let len = this.blocks.push([])
        this.addBlock(len-1, title);
    }


    removeBlock(columnIndex, blockIndex): void {
  	    if (blockIndex !== 0) {
  		      this.blocks[columnIndex].splice(blockIndex);
  	    } else {
  		      this.blocks.splice(columnIndex)
  	    }
        let to_server = {
            block: blockIndex,
            column: columnIndex
        }
        this.http.post(server + '/remove', JSON.stringify(to_server)).subscribe(
            function(resp) {
                console.log(resp.json())
            }
        )
    }

    all(): string[][] {
  	    return this.blocks;
    }

}
