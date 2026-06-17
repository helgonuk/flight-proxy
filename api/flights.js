func fetchAirportBoard(code: String, mode: String, completion: @escaping ([FIDSFlight]) -> Void) {
    let proxyBaseUrl = "https://prm-jl5xmc891-blas2.vercel.app/api/flights"
    let urlString = "\(proxyBaseUrl)?code=\(code)&mode=\(mode)"
    
    guard let url = URL(string: urlString) else {
        print("DEBUG: Invalid URL")
        completion([])
        return
    }
    
    print("DEBUG: Requesting data via Proxy for \(code)...")
    
    URLSession.shared.dataTask(with: url) { data, _, error in
        if let error = error {
            print("DEBUG: Proxy Network Error: \(error.localizedDescription)")
            DispatchQueue.main.async { completion([]) }
            return
        }
        
        guard let data = data else {
            print("DEBUG: Server returned no data")
            DispatchQueue.main.async { completion([]) }
            return
        }
        
        // This confirms the data is arriving from your Vercel proxy
        if let jsonString = String(data: data, encoding: .utf8) {
            print("DEBUG: Received JSON (first 200 chars): \(jsonString.prefix(200))")
        }
        
        // --- KEEP YOUR EXISTING PARSING LOGIC HERE ---
        do {
            if let json = try JSONSerialization.jsonObject(with: data) as? [String: Any],
               let result = json["result"] as? [String: Any],
               let response = result["response"] as? [String: Any],
               let airport = response["airport"] as? [String: Any],
               let pluginData = airport["pluginData"] as? [String: Any],
               let schedule = pluginData["schedule"] as? [String: Any],
               let modeData = schedule[mode] as? [String: Any],
               let dataArray = modeData["data"] as? [[String: Any]] {
                
                var parsedFlights: [FIDSFlight] = []
                for item in dataArray {
                    // ... [Your existing logic to build FIDSFlight] ...
                    if let flight = item["flight"] as? [String: Any],
                       let identification = flight["identification"] as? [String: Any],
                       let number = identification["number"] as? [String: Any],
                       let defaultNum = number["default"] as? String,
                       let status = flight["status"] as? [String: Any],
                       let text = status["text"] as? String,
                       let airline = flight["airline"] as? [String: Any] {
                        
                        let airportInfo = flight["airport"] as? [String: Any] ?? [:]
                        let originDict = airportInfo["origin"] as? [String: Any]
                        let originIATA = (originDict?["code"] as? [String: Any])?["iata"] as? String ?? (originDict?["name"] as? String ?? "N/A")
                        let destDict = airportInfo["destination"] as? [String: Any]
                        let destIATA = (destDict?["code"] as? [String: Any])?["iata"] as? String ?? (destDict?["name"] as? String ?? "N/A")
                        
                        parsedFlights.append(FIDSFlight(
                            callsign: (identification["callsign"] as? String) ?? defaultNum,
                            flightNumber: defaultNum,
                            origin: originIATA.uppercased(),
                            destination: destIATA.uppercased(),
                            statusText: text,
                            logoUrl: airline["logo"] as? String ?? ""
                        ))
                    }
                }
                print("DEBUG: Successfully parsed \(parsedFlights.count) flights.")
                DispatchQueue.main.async { completion(parsedFlights) }
            }
        } catch {
            print("DEBUG: JSON Parsing Exception: \(error)")
            DispatchQueue.main.async { completion([]) }
        }
    }.resume()
}
