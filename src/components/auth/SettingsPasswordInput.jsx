import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function SettingsPasswordInput({ label, name, ...props }) {
  const [visible, setVisible] = useState(false);
  const id = `admin-${name}`;
  const action = `${visible ? 'Hide' : 'Show'} ${label.toLowerCase()}`;
  return <div className="settings-password-field">
    <label htmlFor={id}>{label}</label>
    <div className="settings-password-input">
      <input {...props} id={id} name={name} type={visible ? 'text' : 'password'} />
      <button type="button" className="settings-password-toggle" aria-label={action} title={action}
        aria-controls={id} aria-pressed={visible} onClick={() => setVisible(value => !value)}>
        {visible ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
      </button>
    </div>
  </div>;
}
