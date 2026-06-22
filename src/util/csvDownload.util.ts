export const triggerCsvDownload = (csvContent: string, fileName: string) => {
  const csvBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const csvUrl = URL.createObjectURL(csvBlob);
  const downloadLink = document.createElement('a');

  downloadLink.href = csvUrl;
  downloadLink.download = fileName;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(csvUrl);
};
