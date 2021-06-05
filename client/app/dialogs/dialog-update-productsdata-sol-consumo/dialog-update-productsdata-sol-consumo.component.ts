import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ToastComponent } from 'client/app/shared/toast/toast.component';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
//servicios
import { SolicitudCompraService } from 'client/app/services/solicitudcompra.service';
//models
import { Almacen } from 'client/app/shared/models/almacen.model';
import { ProductoConsumoInterno } from 'client/app/shared/models/productosconsumointerno.model';
import { Materiales } from 'client/app/shared/models/materiales.model';
import { CentrosConsumoInt } from 'client/app/shared/models/centrosconsumoint.model';
import { CentroCostos } from 'client/app/shared/models/centrocostos.model';
import { Empresa } from 'client/app/shared/models/empresa.model';

import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { CaducidadConsumoInt } from 'client/app/shared/models/caducidadconsumoint.model';
import { CuentaMayor } from 'client/app/shared/models/cuentamayor.model';
import { UnidadMedida } from 'client/app/shared/models/umedida.model';





@Component({
  selector: "app-dialog-update-productsdata-sol-consumo",
  templateUrl: "./dialog-update-productsdata-sol-consumo.component.html",
  styleUrls: ["./dialog-update-productsdata-sol-consumo.component.css"],
})
export class DialogUpdateProductsdataSolConsumoComponent implements OnInit {
  Empresa:Empresa = new Empresa();
  Centro:CentrosConsumoInt = new CentrosConsumoInt();
  ProductConsumInt: ProductoConsumoInterno = new ProductoConsumoInterno();
  
  
  protected ListAlmacen: Almacen[];
  public AlmacenCrtl: FormControl = new FormControl();
  public AlmacenFilterCtrl: FormControl = new FormControl();
  public filteredAlmacen: ReplaySubject<Almacen[]> = new ReplaySubject<Almacen[]>(1);
  SelectedAlmacen:Almacen;

  protected ListMateriales: Materiales[];
  public MaterialesCtrl: FormControl = new FormControl();
  public MaterialesFilterCtrl: FormControl = new FormControl();
  public filteredMaterial: ReplaySubject<Materiales[]> = new ReplaySubject<Materiales[]>(1);
  Materiales:Materiales;

  protected ListCCostos: CentroCostos[];
  public CCostosCrtl: FormControl = new FormControl();
  public CCosotosFilterCtrl: FormControl = new FormControl();
  public filteredCCostos: ReplaySubject<CentroCostos[]> = new ReplaySubject<CentroCostos[]>(1);
  SelectedCentroCost:CentroCostos;

  public ListCaducidad: CaducidadConsumoInt[] = [];
  public CADUCIDAD: CaducidadConsumoInt = new CaducidadConsumoInt();
  public CaducidadCtrl: FormControl = new FormControl();
  public CaducidadFilterCtrl: FormControl = new FormControl();
  public filteredCaducidad: ReplaySubject<CaducidadConsumoInt[]> = new ReplaySubject<CaducidadConsumoInt[]>(1);
  SelectCaducidad:CaducidadConsumoInt;

  protected ListCmayor: CuentaMayor[];
  public CMayorCtrl: FormControl = new FormControl();
  public CMayorFilterCtrl: FormControl = new FormControl();
  public filteredCMayor: ReplaySubject<CuentaMayor[]> = new ReplaySubject<CuentaMayor[]>(1);
  SelectCuentaMayor:CuentaMayor;

  protected ListUnidadMedida: UnidadMedida[];
  public UnidadMedidaCtrl: FormControl = new FormControl();
  public UnidadMedidaFilterCtrl: FormControl = new FormControl();
  public filteredUnidadMedida: ReplaySubject<UnidadMedida[]> = new ReplaySubject<UnidadMedida[]>(1);
  SelectUnidadMedida:UnidadMedida;

  protected _onDestroy = new Subject<void>();

  constructor(
    public dialogRef: MatDialogRef<DialogUpdateProductsdataSolConsumoComponent>,
    private solicitudComp: SolicitudCompraService,
    public toast: ToastComponent,
    @Inject(MAT_DIALOG_DATA) public data: ProductoConsumoInterno
  ) {}

  ngOnInit(): void {
    console.log("*/*/*/*/*/*/*/*/*/*/");
    console.log(this.data);
    this.Centro.IdCentro = this.data[1][0].IdCentro;
    this.Centro.NombreCentro = this.data[1][0].NameCentro;
    this.Empresa.Bukrs = this.data[1][0].IdEmpresa;
    this.Empresa.Butxt = this.data[1][0].NameEmpresa;
    this.getAllAlmacen(this.Centro.IdCentro);
    this.getAllCentroCosto(this.Empresa, this.Centro);
    this.getAllCuentasMayor(this.Empresa);
  }

  getAllAlmacen(IdCentro:string) {
    this.ListAlmacen = this.solicitudComp.getAllAlmacenConsumoInt(IdCentro);
    this.AlmacenCrtl.setValue(this.ListAlmacen[0]);
    this.filteredAlmacen.next(this.ListAlmacen);
    this.AlmacenFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterAlmacen();
      });
  }

  filterAlmacen() {
    if (!this.AlmacenFilterCtrl) {
      return;
    }
    //obtenemos la palabra clave
    let search = this.AlmacenFilterCtrl.value;
    if (!search) {
      this.filteredAlmacen.next(this.ListAlmacen.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredAlmacen.next(
      this.ListAlmacen.filter(
        (alma) => alma.Nombre.toLowerCase().indexOf(search) > -1
      )
    );
  }

  selectedAlmacen() {
    console.log(this.SelectedAlmacen);
    this.getAllMateriales(this.Centro, this.SelectedAlmacen);
  }

  getAllMateriales(IdCentro: CentrosConsumoInt, IdAlmacen: Almacen) {
    this.ListMateriales = this.solicitudComp.getAllmaterialesConsumoInt(
      IdCentro,
      IdAlmacen
    );
    this.MaterialesCtrl.setValue(this.ListMateriales[0]);
    this.filteredMaterial.next(this.ListMateriales);
    this.MaterialesFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterMaterial();
      });
  }

  filterMaterial() {
    if (!this.MaterialesFilterCtrl) {
      return;
    }
    //obtenemos la palabra clave
    let search = this.MaterialesFilterCtrl.value;
    if (!search) {
      this.filteredMaterial.next(this.ListMateriales.slice());
      return;
    } else {
      search = search.toLowerCase();
    }

    this.filteredMaterial.next(
      this.ListMateriales.filter(
        (mat) => mat.Nombre.toLowerCase().indexOf(search) > -1
      )
    );
  }

  SelectMat() {
    this.getCaducidad(this.SelectedAlmacen, this.Materiales, this.Centro);
    this.getunidadMedida(this.Materiales.IdMaterial);
  }

  getCaducidad(
    Almacen: Almacen,
    Material: Materiales,
    Centro: CentrosConsumoInt
  ) {
    this.ListCaducidad = [];
    console.log("*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/");
    console.log(Almacen.IdAlmacen +"-----" +Material.IdMaterial +"-----" +Centro.IdCentro);
    this.CADUCIDAD = this.solicitudComp.getAllCaducidad(
      Almacen.IdAlmacen,
      Material.IdMaterial,
      Centro.IdCentro
    );
    console.log(this.ListCaducidad);
    this.ListCaducidad.push(this.CADUCIDAD);
  }

  getAllCentroCosto(IdEmpresa: Empresa, IdCentro: CentrosConsumoInt) {
    //console.log("Centro de Costos--->>" + IdEmpresa.Bukrs + "     " + IdCentro.NombreCentro);
    this.ListCCostos = this.solicitudComp.getCentoCostoConsumiInterno(
      IdEmpresa,
      IdCentro.IdCentro
    );
    console.log(this.ListCCostos);
    this.CCostosCrtl.setValue(this.ListCCostos[0]);
    this.filteredCCostos.next(this.ListCCostos);

    this.CCosotosFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterCCosotos();
      });
  }

  filterCCosotos() {
    if (!this.CCosotosFilterCtrl) {
      return;
    }
    //obtenemos la palabra clave buscar
    let search = this.CCosotosFilterCtrl.value;
    //console.log(search)
    if (!search) {
      this.filteredCCostos.next(this.ListCCostos.slice());
      return;
    } else {
      search = search.toLowerCase();
    }

    this.filteredCCostos.next(
      this.ListCCostos.filter(
        (ccosto) => ccosto.IdCentroCosto.toLowerCase().indexOf(search) > -1
      )
    );
  }

  SelectedCentroCostos() {
    //pasamos los datos seleccionado a el objeto Producto
    //this.ProductConsumInt.CentroCosto = this.DataConsumInt.CentroCostos.IdCentroCosto;
    //this.ProductConsumInt.CentroCostoName = this.DataConsumInt.CentroCostos.Nombre;
  }

  getAllCuentasMayor(IdEmpresa: Empresa) {
    this.ListCmayor = this.solicitudComp.getCuentaMayor(IdEmpresa, " ");
    console.log(this.ListCmayor);
    this.CMayorCtrl.setValue(this.ListCmayor[0]);
    this.filteredCMayor.next(this.ListCmayor);
    this.CMayorFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterCmayor();
      });
  }

  filterCmayor() {
    if (!this.CMayorFilterCtrl) {
      return;
    }
    //obtenemos la palabra clave
    let search = this.CMayorFilterCtrl.value;
    if (!search) {
      this.filteredCMayor.next(this.ListCmayor.slice());
      return;
    } else {
      search = search.toLowerCase();
    }

    this.filteredCMayor.next(
      this.ListCmayor.filter(
        (cmayor) => cmayor.Nombre.toLowerCase().indexOf(search) > -1
      )
    );
  }

  selectionCMayor() {
    // this.ProductConsumInt.CuentaMayor = this.DataConsumInt.Cuentamayor.IdCuentaMayor;
    // this.ProductConsumInt.CuentaMayorName = this.DataConsumInt.Cuentamayor.Nombre;
    // this.SelectedCMayor = this.DataConsumInt.Cuentamayor;
    // this.Producto.CuentaMayor = IdCMayor;
    // this.Producto.CuentaMayorName = CMayorName;
    // console.log(this.DataConsumInt.Cuentamayor.IdCuentaMayor);
    // console.log(this.DataConsumInt.Cuentamayor.Nombre);
  }

  getunidadMedida(idMaterial: String) {
    //console.log("Id de el Material ---> " + idMaterial);
    this.ListUnidadMedida = this.solicitudComp.GetAllUnidadMedida(idMaterial);
    this.UnidadMedidaCtrl.setValue(this.ListUnidadMedida[0]);
    this.filteredUnidadMedida.next(this.ListUnidadMedida);
    this.UnidadMedidaFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterunidadMedida();
      });
  }

  filterunidadMedida() {
    if (!this.UnidadMedidaFilterCtrl) {
      return;
    }
    //obtenemos la palabra clave
    let search = this.UnidadMedidaFilterCtrl.value;
    if (!search) {
      this.filteredUnidadMedida.next(this.ListUnidadMedida.slice());
      return;
    } else {
      search = search.toLowerCase();
    }

    this.filteredUnidadMedida.next(
      this.ListUnidadMedida.filter(
        (umedida) =>
          umedida.NombreUnidadMedida.toLowerCase().indexOf(search) > -1
      )
    );
  }

  onUpdate(){

    this.ProductConsumInt.Almacen = (this.SelectedAlmacen != undefined) ? this.SelectedAlmacen.IdAlmacen : this.data[0].Almacen;
    this.ProductConsumInt.AlmacenName = (this.SelectedAlmacen != undefined) ? this.SelectedAlmacen.Nombre : this.data[0].AlmacenName;
    this.ProductConsumInt.Material = (this.Materiales != undefined) ? this.Materiales.IdMaterial : this.data[0].Material;
    this.ProductConsumInt.MaterialName = (this.Materiales != undefined) ? this.Materiales.Nombre : this.data[0].MaterialName;
    this.ProductConsumInt.CentroCosto = (this.SelectedCentroCost) ? this.SelectedCentroCost.IdCentroCosto : this.data[0].CentroCostos;
    this.ProductConsumInt.CentroCostoName = (this.SelectedCentroCost) ? this.SelectedCentroCost.Nombre : this.data[0].CentroCostosName;
    this.ProductConsumInt.Caducidad = (this.SelectCaducidad != undefined) ? this.SelectCaducidad.CHARG : this.data[0].Caducidad;
    this.ProductConsumInt.CuentaMayor = (this.SelectCuentaMayor != undefined) ? this.SelectCuentaMayor.IdCuentaMayor : this.data[0].CuentaMayor;
    this.ProductConsumInt.CuentaMayorName = (this.SelectCuentaMayor != undefined) ? this.SelectCuentaMayor.Nombre : this.data[0].CuentaMayorName;
    this.ProductConsumInt.UnidadMedida = (this.SelectUnidadMedida != undefined) ? this.SelectUnidadMedida.IdUnidadMedida : this.data[0].UnidadMedida;
    this.ProductConsumInt.NameUnidadMedida = (this.SelectUnidadMedida != undefined) ? this.SelectUnidadMedida.NombreUnidadMedida : this.data[0].UnidadMedidaName;
    console.log(this.ProductConsumInt);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onYesClick(): void {
    this.dialogRef.close("Mensaje Enviado desde el DIALOG");
  }
}
