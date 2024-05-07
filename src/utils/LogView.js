//function de logs

 async function log_viewn(log, sucess) {
  var console_slug = {sucess: log, log: ''+sucess+''};
  const log_console_log = JSON.stringify(console_slug);
  console.log(console_slug);
}

export default log_viewn; 
