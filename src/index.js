// import avatar from './static/github.jpg';
// import styles from  './index.scss';
// import './style.css';
// var img = new Image();
// img.src = avatar;
// img.classList.add(styles.avatar);

// import './index.scss';
// var root = document.getElementById('root');
// root.innerHTML = '<div class="iconfont icon-print"></div>';
// console.log("let's get")
// var btn = document.createElement('button');
// btn.innerHTML = '点击';
// document.body.append(btn);
// btn.onclick = function() {
//   var div = document.createElement('div');
//   div.innerHTML = 'item';
//   document.body.append(div);
// }

// import _ from 'lodash';

// console.log(_.join(['a','b','c'], '****'))

function getComponent() {
  return import(/* webpackChunkName: "lodash" */ 'lodash').then(({ default: _ }) => {
    const element = document.createElement('div');
    element.innerHTML = _.join(['Jack', 'Cool'], '-');
    return element;
  })
}

getComponent().then(el => {
  document.body.appendChild(el);
})