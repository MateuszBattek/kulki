"use strict";
var path = require("path");
module.exports = {
    entry: {
        entry: "./src/index.js",
        //nazwa_pliku_wynikowego_2: './src/plik2.ts'
    },
    output: {
        filename: "main.js",
        path: path.resolve(__dirname, "dist"),
    },
    // output: {
    //   path: path.resolve(__dirname, "./dist"),
    //   filename: "[name].bundle.js",
    // },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    watch: true,
};
