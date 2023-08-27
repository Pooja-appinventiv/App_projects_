import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  async validateUser(username: string, password: string): Promise<any> {
    // console.log(username, password);
    // console.log(username === 'pooja');/
    // console.log(password === 'pooja@');
    if (username == 'pooja' && password == 'pooja@@') {
      console.log('Valid user');
      return 'success';
    }
    console.log('Invalid user');
    return null;
  }
}
