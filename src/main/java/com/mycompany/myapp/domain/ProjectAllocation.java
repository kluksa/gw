package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A ProjectAllocation.
 */
@Entity
@Table(name = "project_allocation")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class ProjectAllocation implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "start")
    private LocalDate start;

    @Column(name = "jhi_end")
    private LocalDate end;

    @Column(name = "note")
    private String note;

    @ManyToOne
    @JsonIgnoreProperties(value = { "manager" }, allowSetters = true)
    private Projects project;

    @ManyToOne
    private Employee member;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public ProjectAllocation id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getStart() {
        return this.start;
    }

    public ProjectAllocation start(LocalDate start) {
        this.setStart(start);
        return this;
    }

    public void setStart(LocalDate start) {
        this.start = start;
    }

    public LocalDate getEnd() {
        return this.end;
    }

    public ProjectAllocation end(LocalDate end) {
        this.setEnd(end);
        return this;
    }

    public void setEnd(LocalDate end) {
        this.end = end;
    }

    public String getNote() {
        return this.note;
    }

    public ProjectAllocation note(String note) {
        this.setNote(note);
        return this;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public Projects getProject() {
        return this.project;
    }

    public void setProject(Projects projects) {
        this.project = projects;
    }

    public ProjectAllocation project(Projects projects) {
        this.setProject(projects);
        return this;
    }

    public Employee getMember() {
        return this.member;
    }

    public void setMember(Employee employee) {
        this.member = employee;
    }

    public ProjectAllocation member(Employee employee) {
        this.setMember(employee);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ProjectAllocation)) {
            return false;
        }
        return id != null && id.equals(((ProjectAllocation) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ProjectAllocation{" +
            "id=" + getId() +
            ", start='" + getStart() + "'" +
            ", end='" + getEnd() + "'" +
            ", note='" + getNote() + "'" +
            "}";
    }
}
