func fetchAirportBoard(code: String, mode: String, completion: @escaping ([FIDSFlight]) -> Void) {

    // Replace this with your actual Vercel deployment URL

    let proxyBaseUrl = "https://prm-jl5xmc891-blas2.vercel.app/api/flights"

    let urlString = "\(proxyBaseUrl)?code=\(code)&mode=\(mode)"

    

    guard let url = URL(string: urlString) else { completion([]); return }

    

    // No extra headers needed here! The proxy handles that for you.

    URLSession.shared.dataTask(with: url) { data, _, _ in

        guard let data = data else { DispatchQueue.main.async { completion([]) }; return }

        

        // ... (Keep your existing JSON parsing code exactly as it is) ...

    }.resume()

}
