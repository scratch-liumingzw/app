const path = require('path');

module.exports = {
    devtool: 'source-map',
    entry: "./src/index.jsx",
    output: {
        path: __dirname + "/build-web",
        filename: "bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true
                    }
                }
            },
            {
                test: /\.(css|less)$/,
                include: /node_modules/,
                use: [{
                    loader: 'style-loader'
                }, {
                    loader: 'css-loader',
                }],
            },
            {
                test: /\.(css|less)$/,
                exclude: /node_modules/,
                use: [{
                    loader: 'style-loader'
                }, {
                    loader: 'css-loader',
                    options: {
                        modules: {
                            localIdentName: '[path][name]__[local]--[hash:base64:5]',
                        },
                    }
                }],
            },
            {
                test: /\.(gif|png|jpg|ico|svg)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 100000,
                            name: './asset/image/[hash].[ext]'
                        }
                    }
                ]
            }
        ]
    },
    devServer: {
        port: 8080,
        // compress: false,
        // open: false,
        // hot: true,
        contentBase: path.join(__dirname, "build-web")
    }
};
