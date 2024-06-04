//require itens
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
//const puppeteer = require('puppeteer');
const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const fs = require('fs').promises;
const fetch = require('node-fetch');
var nodeBase64 = require('nodejs-base64-converter');



//pergunto o link de mapeamento, para encurtar o processo
rl.question('Deseja carregar algum salvamento de PILHA? 1 => SIM ou 2 => NÃO ', (name_type) => {

	if (name_type == "1") {
		
		// Requiring users file
		const users = require("./../pilha");
		var pagina_count = users.pagina;
		pagina_count++;

		//salvo a nova pilha
		let user = {
			name: users.name,
			conteudo: users.conteudo,
			topico: users.topico,
			topico2: users.topico2,
			pagina: pagina_count,
		};

		console.log("A página chamada será: "+pagina_count+"");
		fs.writeFile("pilha.json", JSON.stringify(user), err => {
			if (err) throw err; 
		});

		asyncCallss(''+users.name+'', users.conteudo, users.topico, users.topico2, pagina_count);

	
	} else {
		rl.question('Qual link deseja mapear? ', (name) => {
			log_viewn('success', "Link de mapeamento iniciado: ("+name+")");

			rl.question('Qual seria o conteúdo? ', (conteudo) => {
				log_viewn('success', "Conteúdo de mapeamento definido: ("+conteudo+")");

				rl.question('Qual seria o Tópico Específico? ', (topico) => {
					log_viewn('success', "Tópico Específico de mapeamento definido: ("+topico+")");

					rl.question('Qual seria o Tópico Específico 2?', (topico2) => {
						log_viewn('success', "Tópico Específico 2 de mapeamento definido: ("+topico2+")");
						
						rl.question('Qual seria o número da página?', (pagina) => {
							log_viewn('success', "Número da página de mapeamento definido: ("+pagina+")");

							let user = {
								name: name,
								conteudo: conteudo,
								topico: topico,
								topico2: topico2,
								pagina: pagina,
							};

							fs.writeFile("pilha.json", JSON.stringify(user), err => {
								if (err) throw err; 
							});
							
							asyncCallss(''+name+'', conteudo, topico, topico2, pagina);
						});

					});
					
				});
			});

		});
	}

});


//async function
async function asyncCallss(url_mapeamento, conteudo, topico, topico2, pages) {

	//console.log(""+item_show+"/"+pages+"");
	//função closed modal
	async function asyncCall_Closed() {
		//remove modal item
		const button_login = await page.$("body > div.fancybox-overlay.fancybox-overlay-fixed > div > div > a");
		if (button_login) {
		   await button_login.click();
		   await page.waitForTimeout(10000);
		}
	}

	//configurações base para executar o boot
	const browser = await puppeteer.launch({headless: false});
	const page = await browser.newPage();
	await loadCookie(page); //load cookie
	await page.goto('https://app.estuda.com/usuarios_login');

	//pausando o codigo por um momento
	await page.waitForTimeout(15000);

	//safe cookies
	const cookies = await page.cookies();
    const cookieJson = JSON.stringify(cookies, null, 2);
    await fs.writeFile('cookies.json', cookieJson);
    const CHECKED_LETRA = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

    //function get pagina e exercicios + paginacao
    async function asyncCallss_1(url_mapeamento_1, conteudo_1, topico_1, timer, topico_2) {

		//console.log(""+future_page+"/"+timer+"")
		//valido se o login foi realizado
		const login_validation = await page.$("#d_notificacoes");
		if (login_validation) {

			//realizo o redirect para página de questões
			await page.goto(""+url_mapeamento_1+"&inicio="+timer+"");
			await page.waitForTimeout(12000);

			//realizo o async Call Closed
			asyncCall_Closed();
			await page.waitForTimeout(2000);

			//valido se encontrei os exercicios abertos em sua página
			const checked_filter_sucess = await page.$(".panel-title-box");
			if (checked_filter_sucess) {
				log_viewn('success', "Sucesso, começar a filtrar os exercícios..");

				//começo a validação para o for
				let els = [];
				els = await page.$$('.d_questoes div');
				var lego = "";


				//array montar
				const array_full_perguntas = [];

				//inicio o form
				for (let i = 0; i < els.length; i++) {

					//pego o ID do item
					let attr = await els[i].evaluate(el => el.getAttribute("id"), els);

					//valido e removo os exercícios em null
					if (attr == null || attr == "null") {
						//log_viewn('false', "Item removido da listagem de exercícios: ("+attr+")");
					} else {
						const number_replace = attr.replace(/\D/g,"");

						//valido se encontrei os exercicios abertos em sua página
						const checked_questao_fix = await page.$("#d_questao_"+number_replace+"");
						if (checked_questao_fix) {

							//separo as informações da questão
							const checked_questao_fix_out = await page.$("#d_questao_"+number_replace+" > div:nth-child(2) > div.panel-heading > div > h3");
						    if (checked_questao_fix_out) {


									
									let pergunta_complementar ;
									let pergunta_complementar_pos;
									let dificuldade_get;
									let get_names;
									let pergunta_questao; 
								
									const title_questao =  await page.$eval('#d_questao_'+number_replace+' > div:nth-child(2) > div.panel-heading > div.panel-title-box > h3', el => el.innerText);

									
								try {
								 				pergunta_questao =  await page.$eval('#d_questao_'+number_replace+' div:nth-child(2) > div.panel-body.panel-body-perguntas.highlighter-context > div'  , el => el.innerHTML);
								}catch(e){
												pergunta_questao =  await page.$eval('#d_questao_'+number_replace+' div:nth-child(2) > div.panel-body.panel-body-perguntas > div'  , el => el.innerHTML);
												console.log(pergunta_questao)
								}
								 
								

							 try{

									 pergunta_complementar =  await page.$eval('#d_questao_'+number_replace+' div.panel-body.panel-body-perguntas.highlighter-context > div:nth-child(2)'  , el => el.innerHTML);
									
								}catch(e){
								 //	console.log('div da pergunta complemntar não econtrado, seguir')
									pergunta_complementar = "<br>";

								}

								

							try{

									 pergunta_complementar_pos =  await page.$eval('#d_questao_'+number_replace+' div.panel-body.panel-body-perguntas > div.pergunta.pergunta_pos'  , el => el.innerHTML);
									
								}catch(e){
								
									pergunta_complementar_pos = "<br>";
								}
						
							
							

								const materia_get =  await page.$eval('body > div.page-container.page-navigation-top.page-navigation-top-fixed > div > div.row.page-content-wrap > h1 > a', el => el.innerText);
								const df_get =   await page.$('#d_questao_'+number_replace+' div:nth-child(2) > div.panel-heading > div.d-flex.btn-block.justify-content-between > ul > #liTags'+number_replace);
							// console.log((df_get))
								await df_get.click([1])

								try{
									dificuldade_get =  await page.$eval('#d_questao_'+number_replace+' div:nth-child(2) > div.panel-heading > div.panel-title-box > h3 > #dificuldade_tempo_'+number_replace+' > #dificuldade_'+number_replace, el => el.innerText);
 
							 }catch(e){
								 
									dificuldade_get = ''
							 }
							 


							// try{
								get_names =  await page.$eval('#d_questao_'+number_replace+' > div:nth-child(2) > div.panel-heading > div.panel-title-box > span', el => el.innerText);
							
								
								console.log(get_names, 'i=', i)

						// }catch(e){
							 
								// try {
								// 	  //   get_names =  await page.$eval('#d_questao_'+number_replace+' > div:nth-child(2) > div.panel-heading > div.panel-title-box > h3', el => el.innerText);
										

								// 		// }catch(e){

											
								// 		// 	get_names =  await page.$eval('#d_questao_'+number_replace+' > div:nth-child(2) > div.panel-heading > div.panel-title-box > span', el => el.innerText);


								// 		}

										
						// }
						 
						
							

								//get instituição e ano
								const get_names_separate = get_names.split("20");
								var ano_item = "20"+get_names_separate[1]+""
								var name_item = get_names_separate[0];

								// console.log(ano_item)
								// console.log(name_item)

								if (title_questao) {

									if (lego == number_replace) { } else {

										//começo a validação para o for
										let els_Respostas = []; 
										
											els_Respostas = await page.$$('#d_questao_'+number_replace+' > div:nth-child(2) > div:nth-child(3) > div.respostas.form.form-group label');

											


									
										var lego = "";

										//inicio de exibição do form
										for (let is = 0; is < els_Respostas.length;) {

											//capturo o titulo da resposta do form

											let title_resposta
											try {

												title_resposta =  await els_Respostas[is].$eval('p', el => el.innerHTML);
											}catch(e){

											}
											
											if (title_resposta) {

												//console.log('titulo das resposta: ', title_resposta)

												//inner json => juntando 
												array_full_perguntas.push(title_resposta);

												//adiciono um click apenas em um
												if (is == 1) {
													
													await els_Respostas[is].click();
													await page.waitForTimeout(10000);

													//add click em button
													
													const button_responder = await page.$("#d_questao_"+number_replace+" > div:nth-child(2) > div:nth-child(3) > div.respostas.form.form-group > button");
													if (button_responder) {
													   await button_responder.click();
													   await page.waitForTimeout(10000);
													}
												}
											}
											is++;
										}

										//começo a validação para o for
										let els_Respostass = [];
										els_Respostass = await page.$$('#d_questao_'+number_replace+' > div:nth-child(2) > div:nth-child(3) > div.respostas.form.form-group label');


										//inicio de exibição do form
										for (let iss = 0; iss < els_Respostass.length;) {

											//capturo o titulo da resposta do form
											let class_checked_class = await els_Respostass[iss].evaluate(el => el.getAttribute("class"), els_Respostass);
											if (class_checked_class) {

												//adiciono um clic apenas em um
												if (class_checked_class == "check btn-block d-flex justify-content-between certa") {

													//validation if letra
													if (iss == 0) {
														var inner_solp = "A";
													} else if (iss == 1) {
														var inner_solp = "B";
													} else if (iss == 2) {
														var inner_solp = "C";
													} else if (iss == 3) {
														var inner_solp = "D";
													} else if (iss == 4) {
														var inner_solp = "E";
													} else if (iss == 5) {
														var inner_solp = "F";
													} else if (iss == 6) {
														var inner_solp = "H";
													} else {
														var inner_solp = "0";
													}

													

													 const  conteudo = pergunta_questao + "<br>"+  pergunta_complementar + "<br>"+ pergunta_complementar_pos;  

													 
													// console.log("------------------Pergunta questão -------------------")
													// console.log(pergunta_questao)

													// console.log("-----------------Pergunta complementar --------------------")
													// console.log(pergunta_complementar)

													// console.log("-----------------Pergunta pós --------------------")
													// console.log(pergunta_complementar_pos)
													
													// console.log("-------------------Conteudo ------------------------")
													// console.log(conteudo);
													// console.log("------------------------------------------------------")

													// remover possiveis espações em branco 
													const dificuldade_get_req = dificuldade_get.replace(/\s/g, '')
													
													const base64_item = nodeBase64.encode(conteudo);
													const exercicio = [
													  {
													    "titulo":""+title_questao+"",
													    "resposta_certa":""+inner_solp+"",
													    "conteudo":""+base64_item+"",
													    "dificuldade":""+dificuldade_get_req+"",
													    "materia":""+materia_get+"",
													    "instituicao": ""+name_item+"",
													    "ano": ""+ano_item+"",
													    "conteudo_item": ""+conteudo_1+"",
													    "topico": ""+topico_1+"",
													    "topico_2": ""+topico_2+"",
													    "respostas_opcoes":[
													      {
													        array_full_perguntas
													      }
													    ]
													  }

													];
													

													//realizo o envio das informacoes

													
													fetch("https://www.estudie.com.br/dashboard/API_HUB/request_exercicios.php", {
													  method: "post", headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
													  body: JSON.stringify(exercicio)
													})
													.then((response) => { 
														log_viewn('success', "Questão: ("+title_questao+") enviada com sucesso.."); 
													});

												} 

											} 
											iss++;
										}

										lego = number_replace;
										//respostas: array_full_perguntas 
									}
								}

							}

						}
					} 

					array_full_perguntas.splice(0, array_full_perguntas.length)

				}

				await page.waitForTimeout(5000);
			}
		}

		//fechar navegado
		log_viewn('success', 'Processo finalizado, navegador encerrado..');

		// //salvo a nova pilha
		// let user = {
		// 	name: url_mapeamento_1,
		// 	conteudo: conteudo,
		// 	topico: topico,
		// 	topico2: topico2,
		// 	pagina: future_page,
		// };
		
		// fs.writeFile("pilha.json", JSON.stringify(user), err => {
		// 	if (err) throw err; 
		// });

		await page.waitForTimeout(5000);
		await browser.close();


	 

		// // Requiring users file
		// const usersx = require("./pilha");
		// asyncCallss(''+usersx.name+'', usersx.conteudo, usersx.topico, usersx.topico2, usersx.pagina);

	}

	//time de pagination
	asyncCallss_1(url_mapeamento, conteudo, topico, pages, topico2);

	// let item = 0;
	// setInterval(() => {
	// 	item++;
	// 	asyncCallss_1(url_mapeamento, conteudo, topico, item, topico2);
	// }, 380000);
	
}

//load cookie function
loadCookie = async (page) => {
	const cookieJson = await fs.readFile('cookies.json');
    const cookies = JSON.parse(cookieJson);
    await page.setCookie(...cookies);
}

//function de logs
async function log_viewn(log, sucess) {
  var console_slug = {sucess: log, log: ''+sucess+''};
  const log_console_log = JSON.stringify(console_slug);
  console.log(console_slug);
}


async function retrocess_get_value(log) {

	if (log == "0") {
		return "A";
	} else if (log == "1") {
		return "B";
	} else if (log == "2") {
		return "C";
	} else if (log == "3") {
		return "D";
	} else if (log == "4") {
		return "E";
	} else if (log == "5") {
		return "F";
	} else if (log == "6") {
		return "G";
	} else if (log == "7") {
		return "H";
	} else {
		return "A0";
	}

}
