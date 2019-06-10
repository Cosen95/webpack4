import avatar from './static/github.jpg';
import styles from  './index.scss';

var img = new Image();
img.src = avatar;
img.classList.add(styles.avatar);

var root = document.getElementById('root');
root.append(img);