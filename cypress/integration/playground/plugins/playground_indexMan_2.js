/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { BASE_PATH, IM_PLUGIN_NAME } from '../../../utils/constants';
import sampleRolloverPolicy from '../../../fixtures/plugins/index-management-dashboards-plugin/sample_rollover_policy';

const POLICY_ID_ROLLOVER = 'sample_policy_rollover';
const SAMPLE_INDEX_ROLLOVER = 'sample_index_rollover';

describe('Managed indices', () => {
  beforeEach(() => {
    // Set welcome screen tracking to false
    localStorage.setItem('home:welcome:show', 'false');
    // Disable jitter so ISM jobs run without an additional delay
    cy.disableJitter();

    cy.wait(3000);

    // Visit ISM OSD
    cy.visit(`${BASE_PATH}/app/${IM_PLUGIN_NAME}#/managed-indices`);

    // Common text to wait for to confirm page loaded, give up to 60 seconds for initial load
    cy.contains('Edit rollover alias', { timeout: 60000 });

    cy.get('[data-test-subj="toastCloseButton"]').click({ force: true });
  });

  describe('can have policies retried', () => {
    before(() => {
      // Create a policy that rolls over
      cy.createPolicy(POLICY_ID_ROLLOVER, sampleRolloverPolicy);
      // Create index with alias to rollover
      cy.createIndex(SAMPLE_INDEX_ROLLOVER, POLICY_ID_ROLLOVER, {
        aliases: { 'retry-rollover-alias': {} },
      });
    });

    it('successfully', () => {
      // Confirm we have initial policy
      cy.contains(POLICY_ID_ROLLOVER);

      // Speed up execution time to happen in a few seconds
      cy.updateManagedIndexConfigStartTime(SAMPLE_INDEX_ROLLOVER);

      // Wait up to 5 seconds for the managed index to execute
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(5000).reload();
      cy.get('[data-test-subj="toastCloseButton"]').click({ force: true });

      // Confirm managed index successfully initialized the policy
      cy.contains('Successfully initialized', { timeout: 20000 });

      cy.updateManagedIndexConfigStartTime(SAMPLE_INDEX_ROLLOVER);

      // Wait up to 5 seconds for managed index to execute
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(5000).reload();
      cy.get('[data-test-subj="toastCloseButton"]').click({ force: true });

      // Confirm we have a Failed execution, wait up to 20 seconds as OSD takes a while to load
      cy.contains('Failed', { timeout: 20000 });
      cy.contains('Missing rollover_alias');

      // Add rollover alias
      cy.updateIndexSettings(SAMPLE_INDEX_ROLLOVER, {
        'plugins.index_state_management.rollover_alias': 'retry-rollover-alias',
      });

      // Select checkbox for our managed index
      cy.get(
        `[data-test-subj="checkboxSelectRow-${SAMPLE_INDEX_ROLLOVER}"]`
      ).check({ force: true });

      // Click the retry policy button
      cy.get(`[data-test-subj="Retry policyButton"]`).click({ force: true });

      // Click the retry modal button
      cy.get(`[data-test-subj="retryModalRetryButton"]`).click({ force: true });

      // Confirm we got retry toaster
      cy.contains('Retried 1 managed indices');

      // Reload the page
      cy.reload();
      cy.get('[data-test-subj="toastCloseButton"]').click({ force: true });

      // Confirm we see managed index attempting to retry, give 20 seconds for OSD load
      cy.contains('Pending retry of failed managed index', { timeout: 20000 });

      // Speed up next execution of managed index
      cy.updateManagedIndexConfigStartTime(SAMPLE_INDEX_ROLLOVER);

      // Wait up to 5 seconds for managed index to execute
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(5000).reload();
      cy.get('[data-test-subj="toastCloseButton"]').click({ force: true });

      // Confirm managed index successfully rolled over
      cy.contains('Successfully rolled over', { timeout: 20000 });
    });
  });
});
