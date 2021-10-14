package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class TeamAllocationTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(TeamAllocation.class);
        TeamAllocation teamAllocation1 = new TeamAllocation();
        teamAllocation1.setId(1L);
        TeamAllocation teamAllocation2 = new TeamAllocation();
        teamAllocation2.setId(teamAllocation1.getId());
        assertThat(teamAllocation1).isEqualTo(teamAllocation2);
        teamAllocation2.setId(2L);
        assertThat(teamAllocation1).isNotEqualTo(teamAllocation2);
        teamAllocation1.setId(null);
        assertThat(teamAllocation1).isNotEqualTo(teamAllocation2);
    }
}
