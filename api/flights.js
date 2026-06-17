export default async function handler(req, res) {
  const { code, mode } = req.query;
  const url = `https://api.flightradar24.com/common/v1/airport.json?code=${code}&plugin[]=schedule&plugin-setting[schedule][mode]=${mode}&page=1&limit=25`;

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Referer': 'https://www.flightradar24.com/',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });

    if (!response.ok) {
      // If it's still 403, we need to know what's happening
      throw new Error(`Flightradar24 status: ${response.status}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
