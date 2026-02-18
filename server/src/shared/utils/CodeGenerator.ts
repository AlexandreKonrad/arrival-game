import { customAlphabet } from 'nanoid';

const alphabet = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';
const generate = customAlphabet(alphabet, 6);

export class CodeGenerator {
  static generate(): string {
    return generate();
  }
}