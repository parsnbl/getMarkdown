import { test, expect, beforeAll, describe, vi } from "vitest";
import {
  getSelectedHtml,
  parseToMd,
  copyToTheClipboard,
  handleMessageBackground,
} from "../src/scripts/content.js";
import { fs } from 'fs';


const chromeMock = vi.fn(()=> ({
    runtime: {
        onMessage: {
          addListener: vi.fn(),
        }
      }
}))

vi.stubGlobal('chrome', chromeMock);


test("parseToMd", () => {
    const input = fs.readFileSync('tests/DaringFireball.html');
    const expectedOutput = fs.readFileSync('tests/DaringFireball.md');
    const actualAOutput = parseToMd(input);
    expect(actualAOutput).toEqual(expectedOutput);
});
