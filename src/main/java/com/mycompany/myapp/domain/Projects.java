package com.mycompany.myapp.domain;

import java.io.Serializable;
import java.time.LocalDate;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Projects.
 */
@Entity
@Table(name = "projects")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Projects implements Serializable {

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

    @Column(name = "name")
    private String name;

    @Column(name = "note")
    private String note;

    @ManyToOne
    private Employee manager;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Projects id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getStart() {
        return this.start;
    }

    public Projects start(LocalDate start) {
        this.setStart(start);
        return this;
    }

    public void setStart(LocalDate start) {
        this.start = start;
    }

    public LocalDate getEnd() {
        return this.end;
    }

    public Projects end(LocalDate end) {
        this.setEnd(end);
        return this;
    }

    public void setEnd(LocalDate end) {
        this.end = end;
    }

    public String getName() {
        return this.name;
    }

    public Projects name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getNote() {
        return this.note;
    }

    public Projects note(String note) {
        this.setNote(note);
        return this;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public Employee getManager() {
        return this.manager;
    }

    public void setManager(Employee employee) {
        this.manager = employee;
    }

    public Projects manager(Employee employee) {
        this.setManager(employee);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Projects)) {
            return false;
        }
        return id != null && id.equals(((Projects) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Projects{" +
            "id=" + getId() +
            ", start='" + getStart() + "'" +
            ", end='" + getEnd() + "'" +
            ", name='" + getName() + "'" +
            ", note='" + getNote() + "'" +
            "}";
    }
}
