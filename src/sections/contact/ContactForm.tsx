"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { CONTACT } from "@/content/site";
import styles from "./ContactSection.module.css";

type FormStatus = "idle" | "incomplete" | "ready";

const STATUS_MESSAGE: Record<Exclude<FormStatus, "idle">, string> = {
  incomplete: "Completa tu nombre y un correo o WhatsApp para poder responderte.",
  ready:
    "Formulario completo. Todavía no se envía: falta conectarlo a tu correo o WhatsApp.",
};

/**
 * Formulario de contacto. Por ahora solo valida en el navegador;
 * el envío real (correo, WhatsApp o un endpoint propio) se conecta en handleSubmit.
 */
export function ContactForm() {
  const [status, setStatus] = useState<FormStatus>("idle");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("nombre") ?? "").trim();
    const contact = String(data.get("correo") ?? "").trim();
    setStatus(name && contact ? "ready" : "incomplete");
  }

  return (
    <form className={styles.form} noValidate onSubmit={handleSubmit}>
      <div className={styles.row}>
        <label className={styles.field}>
          Nombre
          <input name="nombre" autoComplete="name" required />
        </label>
        <label className={styles.field}>
          Correo o WhatsApp
          <input name="correo" autoComplete="email" required />
        </label>
      </div>
      <label className={styles.field}>
        ¿Qué te interesa?
        <select name="tipo">
          {CONTACT.interests.map((interest) => (
            <option key={interest}>{interest}</option>
          ))}
        </select>
      </label>
      <label className={styles.field}>
        Tu idea en pocas palabras
        <textarea name="mensaje" placeholder={CONTACT.messagePlaceholder} />
      </label>
      <Button type="submit" className={styles.submit}>
        Enviar mensaje
      </Button>
      <p className={styles.note}>
        Vista previa: este formulario todavía no envía mensajes. Hay que conectarlo a tu correo o WhatsApp.
      </p>
      {status !== "idle" && (
        <p className={styles.status} role="status">
          {STATUS_MESSAGE[status]}
        </p>
      )}
    </form>
  );
}
