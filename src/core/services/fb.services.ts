import { db } from 'firebase-config';
import {
  doc,
  DocumentData,
  DocumentReference,
  getDoc,
  setDoc,
} from 'firebase/firestore';

import json from 'shared/data/list.json';

const KEY = '2GMsz5quEU3Q1oFRgmY5';

class FbService {
  private docRef: DocumentReference<DocumentData>;

  constructor() {
    this.docRef = doc(db, 'members', KEY);
  }

  async createDocument() {
    const result: { [key: string]: {} } = {};
    json.forEach(({ en, ko }) => {
      result[en] = { ko, total: 0, correct: 0 };
    });

    await setDoc(this.docRef, result);
  }

  async getData() {
    const doc = await getDoc(this.docRef);
    return doc.data()!;
  }

  async getArrayData() {
    const result: Member[] = [];
    const data = await this.getData();
    Object.entries(data).forEach(([k, v]) => {
      result.push({ en: k, ...v });
    });

    return result;
  }

  async updateDocWhenFail(arr: Member[]) {
    const result = await this.getData();

    arr.forEach(({ en, ko }, index) => {
      const current = result[en];
      if (index === arr.length - 1) {
        result[en] = {
          ko,
          total: current.total + 1,
          correct: current.correct,
        };
      } else {
        result[en] = {
          ko,
          total: current.total + 1,
          correct: current.correct + 1,
        };
      }
    });

    await setDoc(this.docRef, result);
  }

  async udpateDocWhenWin(arr: Member[]) {
    const result = await this.getData();

    arr.forEach(({ en, ko }) => {
      const current = result[en];
      result[en] = {
        ko,
        total: current.total + 1,
        correct: current.correct + 1,
      };
    });

    await setDoc(this.docRef, result);
  }
}

export const Fb = new FbService();
