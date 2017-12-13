module.exports = {
    entry: {
        'index': './app/typescript/src/Index.ts',
        'help': './app/typescript/src/Help.ts',
        'app': './app/typescript/views/App.ts'
    },
    devtool: 'inline-source-map',
    output: {
        path: __dirname + '/public/javascripts/',
        filename: '[name].js'
    },
    resolve: {
        extensions: ['.webpack.js', '.web.js', '.ts', '.js'],
        alias: {
            'vue$': 'vue/dist/vue'
        }
    },
    module: {
        loaders: [
            {test: /\.ts$/, loader: 'ts-loader'}
        ]
    }
    /*
    // minification:
    ,
    plugins: [
        new webpack.optimize.UglifyJsPlugin()
    ]*/
};
