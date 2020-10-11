import { CurrencyPipe } from "@angular/common";
import { Component } from "@angular/core";
import { FormBuilder, FormControl } from "@angular/forms";
// import { ThemePalette } from '@angular/material/core';
import { Options } from "ng5-slider";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  title = "simulador-range-slider";

  simuladorForm = this.fb.group({
    valor: [5000000],
    plazo: [12],
    tasa: [""],
  });

  activarSlider = new FormControl("");

  optionsValor: Options = {
    floor: 300000,
    ceil: 20000000,
    step: 100000,
    showTicks: true,
    ticksArray: [1000000, 5000000, 10000000, 15000000, 20000000],
    translate: (value: number): string => {
      return this.currencyPipe
        .transform(value, "COP", "$", ".0-0")
        .split(",")
        .join(".");
    },
  };

  optionsPlazo: Options = {
    floor: 3,
    ceil: 84,
    step: 6,
    showTicksValues: true,
    stepsArray: [
      { value: 3 },
      { value: 6 },
      { value: 12 },
      { value: 18 },
      { value: 24 },
      { value: 30 },
      { value: 36 },
      { value: 42 },
      { value: 48 },
      { value: 54 },
      { value: 60 },
      { value: 62 },
      { value: 68 },
      { value: 72 },
      { value: 78 },
      { value: 84 },
    ],
  };

  // color: ThemePalette = 'accent';
  checked = false;
  disabled = false;

  constructor(private currencyPipe: CurrencyPipe, private fb: FormBuilder) {}

  valor: number;
  plazo: number;
  tasa: number;
  TEM: number;
  valorTotalIntereses: number;
  cuotas = [];

  ngOnInit() {
    this.TEM = null;
  }

  liquidarCuotaFija() {
  


      this.valor = this.simuladorForm.controls["valor"].value;
      this.plazo = this.simuladorForm.controls["plazo"].value;

 
    this.convertirTEAaTEM();
    this.calcularValorCuota();

    this.cuotas = [];
    let numeroCuota: number = 1;
    let valorIntereses: number;
    let valorCapital: number;
    let saldo: number = this.valor;

    let plazoTemporal = this.plazo;
    let valorCuota: number = this.valorCuota;

    this.valorTotalIntereses = 0;
    while (plazoTemporal >= 1) {
      console.log(saldo);
      valorIntereses = Math.round((saldo * this.TEM) / 100);

      if (saldo < this.valorCuota) {
        valorCuota = saldo + valorIntereses;
      }

      valorCapital = valorCuota - valorIntereses;
      saldo -= valorCapital;

      console.log(valorIntereses);
      this.valorTotalIntereses = this.valorTotalIntereses + valorIntereses;
      console.log(this.valorTotalIntereses);

      let cuota = {
        numeroCuota: numeroCuota,
        valorCapital: valorCapital,
        valorIntereses: valorIntereses,
        saldo: saldo,
      };

      this.cuotas.push(cuota);

      numeroCuota++;
      plazoTemporal--;
    }

    console.log(this.cuotas);
    console.log(this.simuladorForm.value);
  }

  valorCuota: number;
  calcularValorCuota() {
    let valor = this.simuladorForm.controls["valor"].value;
    let plazo = this.simuladorForm.controls["plazo"].value;
    let tasa = this.TEM;

    this.valorCuota =
      this.valor *
      (((this.TEM / 100) * (1 + this.TEM / 100) ** plazo) /
        ((1 + this.TEM / 100) ** plazo - 1));
    this.valorCuota = this.redondearMilSuperior(this.valorCuota);
  }

  convertirTEAaTEM() {
    this.tasa = this.simuladorForm.controls["tasa"].value / 100;
    this.TEM = parseFloat((((1 + this.tasa) ** (1 / 12) - 1) * 100).toFixed(2));

    console.log(this.TEM);
  }

  public redondearMilSuperior(numero: number) {
    let modulo = numero % 1000;
    if (modulo > 0) {
      numero = numero - modulo + 1000;
    }
    return numero;
  }
}
