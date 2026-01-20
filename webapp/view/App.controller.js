sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel",
  "sap/ui/core/date/UI5Date",
  "sap/m/MessageToast",
  "sap/m/MessageBox"
], function (Controller, JSONModel, UI5Date, MessageToast, MessageBox) {
  "use strict";

  const PATIENTS = [
    { id: 1, name: "Alice Brown",   dept: "Cardiology",  status: "admitted",   critical: false },
    { id: 2, name: "Bob Miller",    dept: "Emergency",   status: "admitted",   critical: true  },
    { id: 3, name: "Carol White",   dept: "Pediatrics",  status: "discharged", critical: false },
    { id: 4, name: "Dan Black",     dept: "Cardiology",  status: "admitted",   critical: true  },
    { id: 5, name: "Eva Green",     dept: "Oncology",    status: "admitted",   critical: false }
  ];

  const APPOINTMENTS = [
    { patient: "Alice Brown", doctor: "Dr. Smith",  date: UI5Date.getInstance().getTime() },
    { patient: "Dan Black",   doctor: "Dr. Jones",  date: UI5Date.getInstance().getTime() + 3600000 },
    { patient: "Eva Green",   doctor: "Dr. Lee",    date: UI5Date.getInstance().getTime() + 7200000 }
  ];

  const DOCTORS_ON_DUTY = [
    { name: "Dr. Smith",  dept: "Cardiology", phone: "+1-555-0101", onDuty: true },
    { name: "Dr. Jones",  dept: "Emergency",  phone: "+1-555-0102", onDuty: true },
    { name: "Dr. Lee",    dept: "Pediatrics", phone: "+1-555-0103", onDuty: false }
  ];

  return Controller.extend("hc.dashboard.view.App", {
    onInit: function () {
      this._refreshStats();
      this._refreshAppointments();
      this._refreshDeptList();
      this._refreshDutyDoctor();
      this._initDarkMode();
      this._initAlerts();
      this._initExport();
    },

    _refreshStats: function () {
      const stats = {
        admitted   : PATIENTS.filter(p => p.status === "admitted").length,
        discharged : PATIENTS.filter(p => p.status === "discharged").length,
        critical   : PATIENTS.filter(p => p.status === "admitted" && p.critical).length
      };
      this.getView().setModel(new JSONModel(stats), "stats");
    },

    _refreshAppointments: function () {
      const list = APPOINTMENTS.map(a => ({
        ...a,
        date: UI5Date.getInstance(a.date).toLocaleString()
      }));
      this.getView().setModel(new JSONModel(list), "appointments");
    },

    _refreshDeptList: function () {
      const map = {};
      PATIENTS.forEach(p => { map[p.dept] = (map[p.dept] || 0) + 1; });
      const list = Object.entries(map).map(([dept, count]) => ({ dept, count }));
      this.getView().setModel(new JSONModel(list), "deptData");
    },

    _refreshDutyDoctor: function () {
      this.getView().setModel(new JSONModel(DOCTORS_ON_DUTY.filter(d => d.onDuty)), "duty");
    },

    _initDarkMode: function () {
      this.getView().setModel(new JSONModel({ dark: false }), "app");
    },
    onDarkToggle: function (oEvt) {
      const dark = oEvt.getParameter("state");
      this.getView().getModel("app").setProperty("/dark", dark);
      sap.ui.getCore().applyTheme(dark ? "sap_fiori_3_dark" : "sap_fiori_3");
    },

    _initAlerts: function () {
      setInterval(() => {
        const stats = this.getView().getModel("stats").getData();
        stats.critical += 1;
        this.getView().getModel("stats").setData(stats);
        MessageBox.warning("New CRITICAL patient admitted!", {
          title: "Alert",
          actions: [MessageBox.Action.OK],
          emphasizeAction: MessageBox.Action.OK
        });
      }, 30000);
    },

    _initExport: function () {
      this.onExport = function () {
        const rows = this.getView().getModel("appointments").getData();
        const csv = "Patient,Doctor,Date\n"
                  + rows.map(r => `${r.patient},${r.doctor},${r.date}`).join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "appointments.csv";
        a.click();
        URL.revokeObjectURL(url);
        MessageToast.show("CSV exported");
      };
    },

    /* -------- CLICK HANDLERS -------- */
    onTilePress: function (oEvt) {
      const header = oEvt.getSource().getHeader();
      MessageToast.show("Open detail view for " + header);
    },

    onAppointmentSelect: function (oEvt) {
      const ctx = (oEvt.getParameter("listItem") || oEvt.getSource()).getBindingContext("appointments");
      const data = ctx.getObject();
      MessageBox.show(
        `Patient: ${data.patient}\nDoctor: ${data.doctor}\nTime: ${data.date}`,
        { title: "Appointment Details" }
      );
    },

    onDeptSelect: function (oEvt) {
      const ctx = oEvt.getParameter("listItem").getBindingContext("deptData");
      const { dept, count } = ctx.getObject();
      MessageToast.show(`${dept} currently has ${count} patients`);
    },

    onAddAppointment: function () {
      MessageBox.information("Add-appointment dialog would open here");
    },

    onCallDoctor: function () {
      const doctor = this.getView().getModel("duty").getProperty("/0");
      MessageBox.confirm(`Call ${doctor.name} ?`, {
        onClose: function (s) {
          if (s === MessageBox.Action.OK) {
            MessageToast.show(`Dialling ${doctor.phone}`);
          }
        }
      });
    }
  });
});
