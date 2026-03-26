import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/environment';

export const apiBaseInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.startsWith('http')) {
    return next(req);
  }
  const base = environment.apiUrl.replace(/\/+$/, '');
  const path = req.url.replace(/^\/+/, '');
  return next(req.clone({ url: `${base}/${path}` }));
};
