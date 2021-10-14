package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ProjectAllocationTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ProjectAllocation.class);
        ProjectAllocation projectAllocation1 = new ProjectAllocation();
        projectAllocation1.setId(1L);
        ProjectAllocation projectAllocation2 = new ProjectAllocation();
        projectAllocation2.setId(projectAllocation1.getId());
        assertThat(projectAllocation1).isEqualTo(projectAllocation2);
        projectAllocation2.setId(2L);
        assertThat(projectAllocation1).isNotEqualTo(projectAllocation2);
        projectAllocation1.setId(null);
        assertThat(projectAllocation1).isNotEqualTo(projectAllocation2);
    }
}
