/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  VB_APP_URL,
  VB_INDEX_END_TIME,
  VB_INDEX_ID,
  VB_INDEX_PATTERN,
  VB_INDEX_START_TIME,
  VB_PATH_INDEX_DATA,
  VB_PATH_SO_DATA,
} from '../../../../../../utils/constants';

if (Cypress.env('VISBUILDER_ENABLED')) {
  describe('Vis Builder: Metric Chart', () => {
    before(() => {
      cy.deleteIndex(VB_INDEX_ID);
      cy.bulkUploadDocs(VB_PATH_INDEX_DATA, VB_INDEX_ID);
      cy.importSavedObjects(VB_PATH_SO_DATA);

      cy.visit(VB_APP_URL);

      // Wait for page to load
      cy.getElementByTestId('homeIcon');
      cy.vbSelectDataSource(VB_INDEX_PATTERN);

      // Set Top nav
      cy.setTopNavDate(VB_INDEX_START_TIME, VB_INDEX_END_TIME);

      cy.vbSelectVisType('Metric');
    });

    it('Basic test', () => {
      cy.getElementByTestId('field-age-showDetails').drag(
        '[data-test-subj="dropBoxAddField-metric"]'
      );
      testMetric('54.912');
    });

    after(() => {
      cy.deleteIndex(VB_INDEX_ID);
    });
  });
}

export const testMetric = (value) => {
  cy.getElementByTestId('visualizationLoader')
    .find('.mtrVis__value')
    .should('contain.text', value);
};
