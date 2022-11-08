/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

/// <reference types="cypress" />

describe('Prepare moivegreek sample', () => {
  before(() => {
    it('Adds moviegreek documents', () => {
      cy.exec(
        'curl http://k8s-default-ingressd-bcd9dcba00-1351362808.us-east-1.elb.amazonaws.com'
      ).then((result) => {
        cy.log(result.stdout);
        cy.log(result.stderr);
      });
    });
  });

  it('setup completed', () => {});
});
