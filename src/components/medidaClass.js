/**
 * @class Medida
 * @classDesc Wrapper para los valores a insertar y devolver de medidas de la BBDD
 *
 */


export class Medida {
    /**
     * Creates an instance of MedidaClass
     * @param {number} value - Valor medido de la medida
     * @param {number} LocX - Longitud en grados sexagesimales
     * @param {number} LocY - Latitud en grados sexagesimales
     * @param {number} gasId - Id del tipo de gas
     * @param {number} nodeId - nodeId del nodo utilizado para la medida
     */
    constructor(value,LocX,LocY,gasId,nodeId) {
        this._nodeId = nodeId;
        this._value = value;
        this._LocX = LocX;
        this._LocY = LocY;
        this._gasId = gasId;
    }


    get value() {
        return this._value;
    }

    set value(value) {
        this._value = value;
    }

    get LocX() {
        return this._LocX;
    }

    set LocX(value) {
        this._LocX = value;
    }

    get LocY() {
        return this._LocY;
    }

    set LocY(value) {
        this._LocY = value;
    }

    get gasId() {
        return this._gasId;
    }

    set gasId(value) {
        this._gasId = value;
    }

    get nodeId() {
        return this._nodeId;
    }

    set nodeId(value) {
        this._nodeId = value;
    }
}

