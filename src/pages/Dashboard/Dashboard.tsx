import { JSX } from "react";
import styles from "./Dashboard.module.css";
import Chart from "../../components/Chart/Chart.tsx";

export default function Dashboard(): JSX.Element {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Dashboard</h1>
      <Chart mode="analysis" />
      <Chart mode="users" />
    </div>
  );
}
