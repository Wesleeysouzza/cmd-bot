import fs  from 'fs/promises'
//load cookie function

async function loadCookie (page){
	const cookieJson = await fs.readFile('cookies.json');
    const cookies = JSON.parse(cookieJson);
    await page.setCookie(...cookies);
}

export default loadCookie ;