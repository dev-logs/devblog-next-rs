import jwt from 'jsonwebtoken'
import { add } from 'date-fns'

interface Claims {
  exp: number;
  [key: string]: any;
}

interface Token {
  content: string;
  expiredAt: {
    utcMillisSinceEpoch: number;
  };
}

type Duration = {
  hours?: number;
  minutes?: number;
  seconds?: number;
};

export class JWTGenerator {
  generateJWT(claims: Array<[string, string]>, duration: Duration, secret: string): Token {
    const now = new Date();
    const expiration = add(now, duration);
    const exp = Math.floor(expiration.getTime() / 1000);

    const otherClaims: { [key: string]: string } = {};
    claims.forEach(([key, value]) => {
      otherClaims[key] = value;
    });

    const claimsWithExp: Claims = { exp, other: otherClaims };

    const tokenContent = jwt.sign(claimsWithExp, secret, { algorithm: 'HS256' });

    return {
      content: tokenContent,
      expiredAt: {
        utcMillisSinceEpoch: exp * 1000,
      },
    };
  }
}
