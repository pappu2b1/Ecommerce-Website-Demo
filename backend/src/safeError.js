export function safeError(error){
  const name=error?.name||'Error';
  const message=String(error?.message||'Unknown error')
    .replace(/mongodb(?:\+srv)?:\/\/[^\s]+/gi,'[redacted MongoDB URI]');
  const code=error?.code===undefined?'':` code=${error.code}`;
  return `${name}${code}: ${message}`;
}
