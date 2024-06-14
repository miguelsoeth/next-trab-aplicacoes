import Topbar from "./topbar";
import styles from '../styles/Layout.module.css';

export default function Layout({ children }) {
  return (
    <div className={styles.mainDiv}>
      <Topbar />
      <main className={styles.mainContainer}>{children}</main>
    </div>    
  )
}