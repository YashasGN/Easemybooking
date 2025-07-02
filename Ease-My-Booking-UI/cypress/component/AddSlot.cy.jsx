/// <reference types="cypress" />
import React from "react";
import AddSlot from "../../src/components/organiser/addSlot/addSlot";
import { withMockStore } from "../support/mockStore";

describe("AddSlot Component (Working Tests Only)", () => {
  const mockPackages = [{ id: 1, packageName: "Heritage Tour" }];
  const mockSlots = {
    1: [
      {
        slotsId: 201,
        packageId: 1,
        date: "2025-06-25T00:00:00",
        timeFrom: "10:00:00",
        timeTo: "12:00:00",
        maxTicket: 30,
      },
    ],
  };

  const baseState = {
    packages: { items: mockPackages },
    slotPrice: { slotsByPackageId: mockSlots },
  };

  it("renders form in Add mode", () => {
    withMockStore(
      <AddSlot open={true} handleClose={() => {}} packageId={1} mode="add" />,
      baseState
    );

    cy.contains("Add Slot");
    cy.get('input[name="date"]').should("exist");
    cy.get('input[name="maxTicket"]').should("exist");
    cy.contains("Time From").should("exist");
    cy.contains("Time To").should("exist");
  });

  it("closes dialog on Cancel", () => {
    const handleClose = cy.stub().as("handleClose");

    withMockStore(
      <AddSlot open={true} handleClose={handleClose} packageId={1} mode="add" />,
      baseState
    );

    cy.contains("Cancel").click();
    cy.get("@handleClose").should("have.been.calledOnce");
  });

  it("shows alert if update clicked without selecting slot", () => {
    cy.window().then((win) => cy.stub(win, "alert").as("alertStub"));

    withMockStore(
      <AddSlot open={true} handleClose={() => {}} packageId={1} mode="edit" />,
      baseState
    );

    cy.get('button').contains("Update Slot").click();
    cy.get("@alertStub").should("have.been.calledWith", "Please select a slot to update.");
  });
});
