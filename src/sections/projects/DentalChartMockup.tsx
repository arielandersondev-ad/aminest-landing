import { DENTAL_CHART, type ToothState } from "@/content/projects";
import { cx } from "@/lib/cx";
import { MockupWindow } from "./MockupWindow";
import styles from "./Mockups.module.css";

const toothClass: Record<ToothState, string> = {
  caries: styles.caries,
  restoration: styles.restoration,
  endodontics: styles.endodontics,
};

export function DentalChartMockup({ label }: { label: string }) {
  const { title, patient, nextCheckup, arches, teeth, legend, history } = DENTAL_CHART;

  return (
    <MockupWindow title={title} label={label}>
      <div className={styles.dental}>
        <div className={styles.patient}>
          <div>
            <span className={styles.label}>PACIENTE</span>
            <b>{patient}</b>
          </div>
          <div>
            <span className={styles.label}>PRÓXIMO CONTROL</span>
            <b>{nextCheckup}</b>
          </div>
        </div>

        <div className={styles.chart}>
          <table>
            <tbody>
              {arches.map(([right, left], row) => (
                <tr key={row}>
                  {right.map((tooth) => (
                    <Tooth key={tooth} number={tooth} state={teeth[tooth]} />
                  ))}
                  <td className={styles.midline} />
                  {left.map((tooth) => (
                    <Tooth key={tooth} number={tooth} state={teeth[tooth]} />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.legend}>
          {legend.map((item) => (
            <span key={item.state}>
              <i className={toothClass[item.state]} />
              {item.label}
            </span>
          ))}
        </div>

        <div className={styles.history}>
          {history.map((entry) => (
            <div key={entry.tooth}>
              <time>{entry.tooth}</time>
              <span>{entry.treatment}</span>
              <em className={cx(!entry.done && styles.pending)}>{entry.status}</em>
            </div>
          ))}
        </div>
      </div>
    </MockupWindow>
  );
}

function Tooth({ number, state }: { number: number; state?: ToothState }) {
  return <td className={cx(state && toothClass[state])}>{number}</td>;
}
