package com.projeto.aplicado.backend.service;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Service
public class GeolocationService {

    private final RestTemplate restTemplate;

    // Injeta o RestTemplate configurado como bean global no construtor
    public GeolocationService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    /**
     * Busca as coordenadas (latitude e longitude) de um endereço usando a API do OpenStreetMap (Nominatim).
     *
     * @param address Endereço completo para busca.
     * @return Array com latitude e longitude. Se não encontrar, retorna {0.0, 0.0}.
     */
    public double[] getCoordinatesFromAddress(String address) {
        try {
            // Codifica o endereço para poder usar na URL da requisição
            String encodedAddress = URLEncoder.encode(address, StandardCharsets.UTF_8);

            // Monta a URL da API do Nominatim para busca geocoding
            String url = "https://nominatim.openstreetmap.org/search?format=json&q=" + encodedAddress;

            // Faz a requisição HTTP GET usando o RestTemplate injetado
            String response = restTemplate.getForObject(url, String.class);

            // Converte a resposta JSON para JSONArray para ler os resultados
            JSONArray jsonArray = new JSONArray(response);

            // Se não encontrar resultados, retorna 0,0 para latitude e longitude
            if (jsonArray.isEmpty()) {
                return new double[]{0.0, 0.0};
            }

            // Pega o primeiro resultado do array JSON
            JSONObject location = jsonArray.getJSONObject(0);

            // Extrai latitude e longitude do JSON e converte para double
            double lat = Double.parseDouble(location.getString("lat"));
            double lon = Double.parseDouble(location.getString("lon"));

            // Retorna as coordenadas encontradas
            return new double[]{lat, lon};

        } catch (Exception e) {
            // Em caso de erro, imprime o stack trace e retorna 0,0
            e.printStackTrace();
            return new double[]{0.0, 0.0};
        }
    }
}
