export function serializeCsv(rows) {
  return rows
    .map((row) =>
      row
        .map((value) => {
          let text = String(value ?? "");
          if (/^\s*[=+@-]/.test(text)) text = "'" + text;
          return '"' + text.replaceAll('"', '""') + '"';
        })
        .join(","),
    )
    .join("\r\n");
}
export function downloadCsv(rows, filename) {
  const blob = new Blob(["\uFEFF" + serializeCsv(rows)], {
    type: "text/csv;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1e3);
}
