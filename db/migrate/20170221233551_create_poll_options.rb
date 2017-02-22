class CreatePollOptions < ActiveRecord::Migration[5.0]
  def change
    create_table :poll_options do |t|
      t.integer :poll_id, null: false
      t.text :option, null: false

      t.timestamps
    end
  end
end
