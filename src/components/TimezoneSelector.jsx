import React from "react";

function TimezoneSelector({ selectedZone, onChange }) {
  const timezones = Intl.supportedValuesOf("timeZone");
  return (
    <select
      value={selectedZone}
      onChange={(e) => onChange(e.target.value)}
      className="timezone-selector"
    >
      {timezones.map((tz) => (
        <option key={tz} value={tz}>
          {tz}
        </option>
      ))}
    </select>
  );
}

export default TimezoneSelector;
