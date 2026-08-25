import { Link } from "react-router";
import styles from "./PostCard.module.css";

export default function PostCard({ post }) {
  return (
    <Link to={`/posts/${post.id}`} className={styles.card}>
      <img className={styles.image} src={post.image} alt={post.caption} />
      <div className={styles.body}>
        <p className={styles.id}>Post #{post.id}</p>
        <h2>{post.caption}</h2>
      </div>
    </Link>
  );
}
