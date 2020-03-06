class Vectorary {
  static dot(arrayA, arrayB) {
    if (arrayA.length !== arrayB.length) {
      throw new Error("unequal lengths");
    }
    let acc = 0;
    for (let i = 0; i < arrayA.length; i++) {
      acc += arrayA[i] * arrayB[i];
    }
    return acc;
  }

  static scale(scalar, array) {
    const arrayClone = array.slice();
    for (let i = 0; i < arrayClone.length; i++) {
      arrayClone[i] *= scalar;
    }
    return arrayClone;
  }

  static add(arrayA, arrayB) {
    if (arrayA.length !== arrayB.length) {
      throw new Error("unequal lengths");
    }
    const arrayAClone = arrayA.slice();
    for (let i = 0; i < arrayAClone.length; i++) {
      arrayAClone[i] += arrayB[i];
    }
    return arrayAClone;
  }

  static sub(arrayA, arrayB) {
    if (arrayA.length !== arrayB.length) {
      throw new Error("unequal lengths");
    }
    const arrayAClone = arrayA.slice();
    for (let i = 0; i < arrayAClone.length; i++) {
      arrayAClone[i] -= arrayB[i];
    }
    return arrayAClone;
  }

  static schur(arrayA, arrayB) {
    if (arrayA.length !== arrayB.length) {
      throw new Error("unequal lengths");
    }
    const arrayAClone = arrayA.slice();
    for (let i = 0; i < arrayAClone.length; i++) {
      arrayAClone[i] *= arrayB[i];
    }
    return arrayAClone;
  }

  static init(size, initialValue) {
    const array = [];
    for (let i = 0; i < size; i++) {
      array.push(initialValue);
    }
    return array;
  }

  static zeroes(size) {
    return Vectorary.init(size, 0.0);
  }

  static ones(size) {
    return Vectorary.init(size, 1.0);
  }
}

export default Vectorary;
