export type JwtPayload = {
  azp: string;
  exp: number;
  fva: number[];
  iat: number;
  iss: string;
  nbf: number;
  sid: string;
  sts: string;
  sub: string;
  v: number;
};
