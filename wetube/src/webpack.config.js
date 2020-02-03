// 100% 클라이언트 코드기 때문에(바벨을 쓸 수 없음), 옛날 자바 스크립트 코드를 써야 함(모던 자바스크립트가 아님)

const path = require('path'); // 이전 방식의 파일 임포트 방법
const autoprefixer = require('autoprefixer');
const ExtractCSS = require('extract-text-webpack-plugin');

const MODE = process.env.WEBPACK_ENV;
const ENTRY_FILE = path.resolve(__dirname, 'assets', 'js', 'main.js'); // __dirname : 프로젝트 디렉터리 이름(언제 어디서든 접근 가능한 nodeJS 전역변수)
const OUTPUT_DIR = path.join(__dirname, 'static');

const config = {
  entry: ['@babel/polyfill', ENTRY_FILE],
  mode: MODE, // 개발모드인지 프로덕션모드인지 구분
  module: {
    rules: [
      {
        test: /\.(js)$/,
        use: [
          {
            loader: 'babel-loader',
          },
        ],
      },
      { // 웹펙에서는 아래에서 부터 위로 실행함
        test: /\.(scss)$/,
        use: ExtractCSS.extract([
          {
            loader: 'css-loader',
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins() {
                return [autoprefixer({ browsers: 'cover 99.5%' })];
              },
            },
          },
          {
            loader: 'sass-loader',
          },
        ]),
      },
    ],
  },
  output: {
    path: OUTPUT_DIR,
    filename: '[name].js',
  },
  plugins: [new ExtractCSS('styles.css')], // 저장할 파일의 이름을 넣어줌
};

module.exports = config;
