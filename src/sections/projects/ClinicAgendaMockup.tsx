import { CLINIC_AGENDA } from "@/content/projects";
import { cx } from "@/lib/cx";
import { MockupWindow } from "./MockupWindow";
import styles from "./Mockups.module.css";

export function ClinicAgendaMockup({ label }: { label: string }) {
  const { title, days, activeDay, slots, chat } = CLINIC_AGENDA;

  return (
    <MockupWindow title={title} label={label}>
      <div className={styles.split}>
        <div className={styles.agenda}>
          <div className={styles.days}>
            {days.map((day) => (
              <span key={day} className={cx(day === activeDay && styles.dayActive)}>
                {day}
              </span>
            ))}
          </div>
          {slots.map((slot) => (
            <div key={slot.time} className={cx(styles.slot, !slot.title && styles.slotFree)}>
              <time>{slot.time}</time>
              {slot.title ? (
                <div>
                  <b>{slot.title}</b>
                  <small>{slot.detail}</small>
                </div>
              ) : (
                <div>{slot.detail}</div>
              )}
            </div>
          ))}
        </div>
        <div className={styles.chat}>
          <span className={styles.label}>ASISTENTE</span>
          <div className={cx(styles.message, styles.fromUser)}>{chat.question}</div>
          <div className={cx(styles.message, styles.fromBot)}>{chat.answer}</div>
          <span className={styles.label}>SUGERIDAS PARA TI</span>
          <div className={styles.suggestions}>
            {chat.suggestions.map((suggestion) => (
              <span key={suggestion}>{suggestion}</span>
            ))}
          </div>
        </div>
      </div>
    </MockupWindow>
  );
}
