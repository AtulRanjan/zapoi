Feature: Authentication
  Every user of the system should be able to authenticate
  in order to use some of the user-specific system features

  Scenario: User signs in
    Given I have signed up
    And I am on the login page
    When I enter my credentials
    And I press "Login"
    Then I should be authenticated

  Scenario: User signs out
    Given I have signed up
    And I am on the login page
    When I enter my credentials
    And I press "Login"
    And I sign out
    Then I should not be authenticated