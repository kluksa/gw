package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A TeamAllocation.
 */
@Entity
@Table(name = "team_allocation")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class TeamAllocation implements Serializable {

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
    private Employee member;

    @ManyToOne
    @JsonIgnoreProperties(value = { "leader" }, allowSetters = true)
    private Teams team;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public TeamAllocation id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getStart() {
        return this.start;
    }

    public TeamAllocation start(LocalDate start) {
        this.setStart(start);
        return this;
    }

    public void setStart(LocalDate start) {
        this.start = start;
    }

    public LocalDate getEnd() {
        return this.end;
    }

    public TeamAllocation end(LocalDate end) {
        this.setEnd(end);
        return this;
    }

    public void setEnd(LocalDate end) {
        this.end = end;
    }

    public String getNote() {
        return this.note;
    }

    public TeamAllocation note(String note) {
        this.setNote(note);
        return this;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public Employee getMember() {
        return this.member;
    }

    public void setMember(Employee employee) {
        this.member = employee;
    }

    public TeamAllocation member(Employee employee) {
        this.setMember(employee);
        return this;
    }

    public Teams getTeam() {
        return this.team;
    }

    public void setTeam(Teams teams) {
        this.team = teams;
    }

    public TeamAllocation team(Teams teams) {
        this.setTeam(teams);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof TeamAllocation)) {
            return false;
        }
        return id != null && id.equals(((TeamAllocation) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "TeamAllocation{" +
            "id=" + getId() +
            ", start='" + getStart() + "'" +
            ", end='" + getEnd() + "'" +
            ", note='" + getNote() + "'" +
            "}";
    }
}
