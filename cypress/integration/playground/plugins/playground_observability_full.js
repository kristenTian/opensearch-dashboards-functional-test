/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

/// <reference types="cypress" />

import { moviegeekDataSet } from '../../../utils/constants';

describe('Adds moviegeek related stuff', () => {
  it('Adds moviegeek documents', () => {
    cy.exec(
      'curl http://k8s-default-ingressd-bcd9dcba00-612390087.us-east-1.elb.amazonaws.com/load'
    ).then((result) => {
      cy.log(result.stdout);
      cy.log(result.stderr);
    });
  });
  it('Adds moviegeek-logs index', () => {
    cy.exec(
      'curl http://k8s-default-ingressm-01116c5b67-1615084315.us-east-1.elb.amazonaws.com'
    ).then((result) => {
      cy.log(result.stdout);
      cy.log(result.stderr);
    });
  });
  it('enable Movie Geek to search the data', () => {
    const dumpDataSet = (moviegeek_url) => {
      cy.request(moviegeek_url).then((response) => {
        cy.request({
          method: 'POST',
          form: true,
          url: 'api/console/proxy',
          headers: {
            'content-type': 'application/json;charset=UTF-8',
            'osd-xsrf': true,
          },
          qs: {
            path: '_scripts/simple-search',
            method: 'POST',
          },
          body: response.body,
        });
      });
    };
    moviegeekDataSet.forEach(({ moviegeek_url }) => dumpDataSet(moviegeek_url));
  });
});
