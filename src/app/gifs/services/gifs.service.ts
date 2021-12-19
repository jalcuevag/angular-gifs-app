import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SearchGifsResponse, Gif } from '../interfaces/gifs.interface';

@Injectable({
  providedIn: 'root',
})
export class GifsService {
  private apiKey: string = 'RXHFJDzqFOynE5pYs7p6Erk2woZbxKNB';
  private servicioUrl: string = 'https://api.giphy.com/v1/gifs';
  private _historial: string[] = [];

  public resultados: Gif[] = [];

  get historial() {
    return [...this._historial];
  }

  constructor(private http: HttpClient) {
    this._historial = JSON.parse(localStorage.getItem('historial')!) || [];
    this.resultados = JSON.parse(localStorage.getItem('resultados')!) || [];
    // if (localStorage.getItem('historial')) {
    //   this._historial = JSON.parse(localStorage.getItem('historial')!);
    // }
  }

  buscarGifs(query: string) {
    query = query.trim().toLowerCase();
    if (!this._historial.includes(query)) {
      this._historial.unshift(query);
      this._historial = this._historial.splice(0, 10);

      localStorage.setItem('historial', JSON.stringify(this.historial));
    }
    // fetch(
    //   'https://api.giphy.com/v1/gifs/search?api_key=RXHFJDzqFOynE5pYs7p6Erk2woZbxKNB&q=dragon ball z&limit=10'
    // ).then((resp) => {
    //   resp.json().then((data) => console.log(data));
    // });

    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('limit', '10')
      .set('q', query);

    this.http
      .get<SearchGifsResponse>(`${this.servicioUrl}/search`, { params })
      .subscribe((response) => {
        this.resultados = response.data;
        localStorage.setItem('resultados', JSON.stringify(this.resultados));
      });
  }
}
