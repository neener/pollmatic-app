class CreatePolls < ActiveRecord::Migration[5.0]
  def change
    create_table :polls do |t|
      t.integer :user_id, null: false
      t.text :question, null: false

      t.timestamps
    end
  end
end
