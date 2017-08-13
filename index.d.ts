declare module GreinerHormann {
    export function intersection(source: number[][]|Point[], clip:number[][]|Point[]): any;
    export function union(source: number[][]|Point[], clip:number[][]|Point[]): any;
    export function diff(source: number[][]|Point[], clip:number[][]|Point[]): any;
    
    export interface Point {
        x:number;
        y:number;
    }    
}

export = GreinerHormann;