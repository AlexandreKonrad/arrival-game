import { customAlphabet } from 'nanoid';

const alphabet = '0123456789ABCDEFGHJKMNPQRSTUVWXYZ';
const generate = customAlphabet(alphabet, 6);

export class CodeGenerator {
  static generate(): string {
    return generate();
  }
}