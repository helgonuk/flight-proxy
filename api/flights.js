export default async function handler(req, res) {
  const { code, mode } = req.query;
  const url = `https://api.flightradar24.com/common/v1/airport.json?code=${code}&plugin[]=schedule&plugin-setting[schedule][mode]=${mode}&page=1&limit=25`;

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Referer': 'https://www.flightradar24.com/'
      }
    });

    if (!response.ok) {
      throw new Error(`Flightradar24 returned status ${response.status}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
